import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { IReport } from "../pages/IndexPage";

const SortableList = ({ reports }: { reports: IReport[] }) => {
  const [activeId, setActiveId] = useState<string>("");
  const [items, setItems] = useState(reports);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(`${event.active.id}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId("");
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    setItems(reports);
  }, [reports]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className="sortable-list">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} title={item.title} />
          ))}
          <DragOverlay>
            {activeId ? (
              <SortableItem
                key={items.find((item) => item.id === Number(activeId))?.id}
                id={items.find((item) => item.id === Number(activeId))?.id || 0}
                title={
                  items.find((item) => item.id === Number(activeId))?.title ||
                  ""
                }
              />
            ) : null}
          </DragOverlay>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default SortableList;
