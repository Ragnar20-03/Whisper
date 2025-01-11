type buttonProps = {
  label: string;
  type?: "button" | "submit" | "reset";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
};

export const Button: React.FC<buttonProps> = ({
  label,
  type,
  onClick,
  className,
}) => {
  return (
    <button
      className={
        className ? className : "bg-black p-1 m-1 text-white rounded-sm"
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
};
