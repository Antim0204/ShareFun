const CustomButtton=({title,containerStyles,iconrRight,type,onClick})=>{
  return (
    <button
    onClick={onClick}
    type={type||"button"}
    className={`inline-flex items-center text-base ${containerStyles}`}
    >
    {title}
    {iconrRight && <div className='ml-2'>{iconrRight}</div>}
    </button>
    
  );
  };

export default CustomButtton;
