export default class CameraModule {
    constructor() {
        this.stream = null;
        this.videoElement = null;
    }

    async start(container) {
        // Crear elemento de video
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true; // Importante para iOS
        this.videoElement.classList.add('camera-feed');
        container.appendChild(this.videoElement);

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' } // Intentar usar cámara trasera
            });
            this.videoElement.srcObject = this.stream;
        } catch (err) {
            console.error("Error accediendo a la cámara:", err);
            container.innerHTML = '<p style="color:red">ERROR: CÁMARA NO DISPONIBLE</p>';
        }
    }

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
    }
}
