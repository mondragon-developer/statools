import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-4">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-darkGrey/80">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <li key={item.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {last || !item.to
              ? <span aria-current={last ? 'page' : undefined} className="font-semibold text-darkGrey">{item.label}</span>
              : <Link to={item.to} className="hover:text-darkTeal underline">{item.label}</Link>}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumbs;
