import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton, Panel, Stack } from "rsuite";
import FolderMoveIcon from "@rsuite/icons/FolderMove";
import EditIcon from "@rsuite/icons/Edit";
import { useNavigate } from "react-router";

const SortableItem = ({ id, title }: { id: number; title: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const navigate = useNavigate();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "50" : "auto",
    opacity: isDragging ? 0.3 : 1,
    touchAction: "none",
  };

  return (
    <div ref={setNodeRef} style={style} className="report-card">
      <div>
        <Panel
          bordered
          header={
            <Stack justifyContent="space-between">
              <span>{title}</span>
            </Stack>
          }
        >
          <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
            <IconButton
              {...listeners}
              {...attributes}
              icon={<FolderMoveIcon />}
              appearance="subtle"
              size="sm"
              style={{ cursor: "grab" }}
              aria-label="Drag handle"
            />
            <IconButton
              icon={<EditIcon />}
              size="sm"
              appearance="subtle"
              onClick={() => navigate(`/edit/${id}`)}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default SortableItem;
