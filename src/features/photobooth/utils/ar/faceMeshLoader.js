let faceMeshInstance = null;
let loadingPromise = null;

/**
 * Dynamically loads MediaPipe FaceMesh scripts from CDN and initializes the model.
 * Returns a promise resolving to the FaceMesh singleton instance.
 */
export function loadFaceMesh() {
  if (faceMeshInstance) return Promise.resolve(faceMeshInstance);
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    // 1. Inject script tags if not present
    if (window.FaceMesh) {
      initFaceMesh(resolve, reject);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js';
    script.crossOrigin = 'anonymous';
    script.async = true;

    script.onload = () => {
      initFaceMesh(resolve, reject);
    };

    script.onerror = () => {
      console.warn('Failed to load MediaPipe FaceMesh from CDN.');
      reject(new Error('CDN Load Fail'));
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
}

function initFaceMesh(resolve, reject) {
  try {
    if (!window.FaceMesh) {
      reject(new Error('FaceMesh not defined on window'));
      return;
    }

    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 4,
      refineLandmarks: false,
      minDetectionConfidence: 0.55,
      minTrackingConfidence: 0.55,
      selfieMode: false,
    });

    faceMeshInstance = faceMesh;
    resolve(faceMesh);
  } catch (err) {
    reject(err);
  }
}
