
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GoBack() {
  const navigate = useNavigate();
  return (
    <ChevronLeft
      size={30}
      onClick={() => navigate(-1)}
      className="cursor-pointer bg-blue-200 rounded-full"
    />
  );
}
