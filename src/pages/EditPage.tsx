import { useParams } from "react-router";

const EditPage = () => {
  const { id } = useParams<{ id: string }>();

  return <div style={{ padding: 24 }}>{`Edit report here with id:${id}`}</div>;
};

export default EditPage;
