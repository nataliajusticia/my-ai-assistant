import Chat from '@/components/chat';
import { AI } from './_actions';

export default function Home() {
  return (
    <AI>
      <Chat />
    </AI>
  );
}
