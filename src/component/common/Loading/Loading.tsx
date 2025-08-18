import Lottie from 'lottie-react';
import Loading from '@/assets/lotties/Loading.json';

export default function Loader({ size = 48 }: { size?: number }) {
  return (
    <div role="status" aria-busy="true" style={{ width: size, height: size }}>
      <Lottie animationData={Loading} loop autoplay />
    </div>
  );
}
