import { useRef, useState } from "react"
import { useChatStore } from "../store/useChatStore.js"
import { SendHorizontal, Image, X, FileText } from "lucide-react";
import toast from "react-hot-toast"


const MessageInput = () => {
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(null)

  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdfName, setPdfName] = useState("");

  const fileInputRef = useRef(null)
  const pdfInputRef = useRef(null);

  const { sendMessage } = useChatStore()

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Silakan pilih file gambar");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Silakan pilih file PDF");
      return;
    }

    if (file) {
      setPdfName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePdf = () => {
    setPdfPreview(null);
    setPdfName("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
   if (!text.trim() && !imagePreview && !pdfPreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        pdf: pdfPreview,
      });

     setText("");
     setImagePreview(null);
     setPdfPreview(null);
     setPdfName("");
     if (fileInputRef.current) fileInputRef.current.value = "";
     if (pdfInputRef.current) pdfInputRef.current.value = "";
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
    }
  }
  return (
    <div className="p-4 w-full">
      <div className="mb-3 flex flex-wrap gap-4">
        {imagePreview && (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {pdfPreview && (
          <div className="relative flex items-center gap-2 bg-base-200 p-3 rounded-lg border border-zinc-700">
            <FileText className="text-blue-500" size={24} />
            <span className="text-sm truncate max-w-xs">{pdfName}</span>
            <button
              onClick={removePdf}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:border-0"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={pdfInputRef}
            onChange={handlePdfChange}
          />

          <button
            type="button"
            className={`flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            className={`flex btn btn-circle ${pdfPreview ? "text-blue-500" : "text-zinc-400"}`}
            onClick={() => pdfInputRef.current?.click()}
            title="Upload PDF"
          >
            <FileText size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle"
          disabled={!text.trim() && !imagePreview && !pdfPreview}
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput