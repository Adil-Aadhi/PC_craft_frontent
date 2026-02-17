import { useParams } from "react-router-dom";
import ChatLayout from "../../Chat/components/chatLayout"

const WorkerChatPage = () => {
  const { id } = useParams();

  const receiver = {
    id: Number(id),
    name: "User",
  };

  return <ChatLayout receiver={receiver} />;
};

export default WorkerChatPage;
