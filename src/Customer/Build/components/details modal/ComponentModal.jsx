import { useSelector, useDispatch } from "react-redux";
import { closeComponentModal } from "../../redux/components/componentModalSlice";
import ModalContent from "./ModalContent";
import { useEffect } from "react";

const ComponentModal = ({ componentData }) => {
  const dispatch = useDispatch();

  const { isOpen, category, componentId } = useSelector(
    (state) => state.componentModal
  );

  const build = useSelector((state) => state.build.selected);

  const data = category ? componentData[category]?.items : null;

  let component = null;

  if (Array.isArray(data)) {
    component = data.find((item) => item.id === componentId);
  }

  if (!component) {
    component = build?.[category] || null;
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !component) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => dispatch(closeComponentModal())}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl shadow-2xl scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalContent category={category} component={component} />
      </div>
    </div>
  );
};

export default ComponentModal;