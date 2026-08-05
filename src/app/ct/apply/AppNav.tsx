type Props = {
  step?: string;
  rightAction?: React.ReactNode;
};

export function AppNav({ step, rightAction }: Props) {
  return (
    <div className="app-nav">
      <a className="brand" href="/ct">
        <span className="mark" aria-hidden="true" />
        <span className="name">CT Battery Solutions</span>
      </a>
      <div className="app-nav-meta">
        {step && <span>{step}</span>}
        {rightAction}
      </div>
    </div>
  );
}
