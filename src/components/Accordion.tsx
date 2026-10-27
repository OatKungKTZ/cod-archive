import { Plus } from "lucide-react";
import type { ReactNode } from "react";
function Accordion({
  title,
  children,
  open = false,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="accordion" open={open}>
      <summary>
        {title}
        <Plus size={17} />
      </summary>
      <div className="accordion-body">{children}</div>
    </details>
  );
}

export default Accordion;
