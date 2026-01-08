export default function WebScheduleSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-150">
          <div className="bg-background-neutral-subtle rounded-radius-large aspect-[2/3] w-full animate-pulse" />
          <div className="bg-background-neutral-subtle rounded-radius-small h-4 w-3/4 animate-pulse" />
          <div className="bg-background-neutral-subtle rounded-radius-small h-3 w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  );
}