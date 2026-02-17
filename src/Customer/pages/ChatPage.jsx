import { useParams } from "react-router-dom";
import ChatLayout from "../../Chat/components/ChatLayout";

const UserChatPage = () => {
  const { id } = useParams();

  const receiver = {
    id: Number(id),
    name: "Worker",
  };

  return <ChatLayout receiver={receiver} />;
};

export default UserChatPage;
