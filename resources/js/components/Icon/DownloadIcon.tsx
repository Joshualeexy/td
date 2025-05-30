import { IconType } from "@/types"
const DownloadIcon: React.FC<IconType> = ({className})=>{

 return (
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth="1.5"
  stroke="currentColor"
  className={`w-5 h-5 inline-block mr-2 ${className}`}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5M12 16.5L7.5 12M12 16.5V3"
  />
</svg>


  )
}

export default DownloadIcon
