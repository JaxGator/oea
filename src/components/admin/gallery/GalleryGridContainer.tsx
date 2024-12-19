import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { SortableImage } from "./SortableImage";
import { ImageType } from "./types/gallery";

interface GalleryGridContainerProps {
  images: ImageType[];
  onImageDelete: (imageUrl: string) => void;
  onReorder: (newOrder: ImageType[]) => void;
}

export function GalleryGridContainer({ images, onImageDelete, onReorder }: GalleryGridContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);
      
      const newOrder = arrayMove(images, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SortableContext items={images} strategy={rectSortingStrategy}>
          {images.map((image) => (
            <SortableImage
              key={image.id}
              image={image}
              onDelete={() => onImageDelete(image.url)}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
}