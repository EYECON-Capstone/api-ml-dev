const tf = require('@tensorflow/tfjs-node')

exports.predictClasification = async (model, img) => {
    
    const tensor =  tf.node.decodeImage(img, 3).resizeBilinear([256, 256]).div(255.0).expandDims(0)
    const prediction = await model.predict(tensor).data()
    const predict = Object.keys(prediction).reduce((max, key) => prediction[key] > prediction[max] ? key : max, "0");

    return predict
}