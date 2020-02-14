const video = document.getElementById('video')

function onVideo() 
{
  navigator.getUserMedia({ 
    video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./modele'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./modele'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./modele'),
  faceapi.nets.faceExpressionNet.loadFromUri('./modele'),
]).then(onVideo)


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  
  setInterval(async () =>
   {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    faceapi.draw.drrawAgeAndGender(canvas, resizedDetections)
  }, 100)
})