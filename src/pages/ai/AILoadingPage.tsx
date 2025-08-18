import { AIComment, AIImage } from '@/assets';
import { Loader } from '@/component';

export default function AILoadingPage() {
  return (
    <div className="bg-green3 min-h-screen place-items-center">
      <Loader className="w-70 pt-40 pb-10" />
      <AIComment />
      <AIImage />
    </div>
  );
}
