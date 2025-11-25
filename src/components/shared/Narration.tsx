interface NarrationProps {
  text: string | null;
}

export default function Narration({ text }: NarrationProps) {
  if (!text) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-gray-900 bg-opacity-95 text-white px-8 py-4 rounded-full shadow-2xl border-2 border-gray-700 max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">🎙️</span>
          <p className="text-base font-medium leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
