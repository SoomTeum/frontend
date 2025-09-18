export function geocodeAddress(address: string): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps?.services) return reject(new Error('Kakao SDK not loaded'));
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any[], status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result[0]) {
        const { x, y } = result[0]; // x: lng, y: lat
        resolve({ lat: Number(y), lng: Number(x) });
      } else {
        reject(new Error('주소를 좌표로 변환하지 못했습니다.'));
      }
    });
  });
}
