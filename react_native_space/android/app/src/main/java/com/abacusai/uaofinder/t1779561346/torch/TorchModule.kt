
package com.tuapp.torch

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.facebook.react.bridge.*
import org.pytorch.IValue
import org.pytorch.Module
import org.pytorch.Tensor
import org.pytorch.torchvision.TensorImageUtils

class TorchModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var module: Module? = null

    override fun getName(): String {
        return "TorchModule"
    }

    @ReactMethod
    fun predict(imageData: ReadableMap, promise: Promise) {
        try {
            val base64 = imageData.getString("base64")
            val bytes = Base64.decode(base64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)

            val resized = Bitmap.createScaledBitmap(bitmap, 224, 224, true)

            val input = TensorImageUtils.bitmapToFloat32Tensor(
                resized,
                floatArrayOf(0.485f, 0.456f, 0.406f),
                floatArrayOf(0.229f, 0.224f, 0.225f)
            )

            if (module == null) {
                module = Module.load("model.pt")
            }

            val output = module!!.forward(IValue.from(input)).toTensor()
            val scores = output.dataAsFloatArray

            var maxIndex = 0
            var maxScore = scores[0]

            for (i in scores.indices) {
                if (scores[i] > maxScore) {
                    maxScore = scores[i]
                    maxIndex = i
                }
            }

            val result = Arguments.createMap()
            result.putInt("classIndex", maxIndex)
            result.putDouble("confidence", maxScore.toDouble())

            promise.resolve(result)

        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
