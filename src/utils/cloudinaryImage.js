const CLOUDINARY_HOST = 'res.cloudinary.com';

/**
 * Agrega optimizaciones de entrega a una URL de Cloudinary.
 * Mantiene la transformación base aplicada al subir (rostro/circular),
 * y optimiza formato/calidad/tamaño al momento de mostrar.
 */
export function optimizeCloudinaryImage(url, { width = 256 } = {}) {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    const isCloudinary = parsed.hostname.includes(CLOUDINARY_HOST);
    const uploadMarker = '/upload/';

    if (!isCloudinary || !parsed.pathname.includes(uploadMarker)) {
      return url;
    }

    const [prefix, suffix] = parsed.pathname.split(uploadMarker);
    const deliveryTransform = `f_auto,q_auto,dpr_auto,w_${width},c_limit`;

    parsed.pathname = `${prefix}${uploadMarker}${deliveryTransform}/${suffix}`;
    return parsed.toString();
  } catch {
    return url;
  }
}
