import { useDroppable } from '@dnd-kit/core';



function Droppable(props: any) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };


    return (
        <div ref={setNodeRef} style={style} className='w-full min-h-48 bg-red-500/30'>
            {props.children}
        </div>
    );
}

export default Droppable;