
import { Link,usePage } from '@inertiajs/react';

const EasyLayout = () => {

    const page = usePage()

    type Link = {
        id: number;
        title: string;
        route: string;
        active: boolean;
    }

    const links: Link[] = [
        {
            id: 1,
            title: 'Tiktok',
            route: 'index',
            active: true,

        },

        // {
        //     id: 2,
        //     title: 'Tiktok Likes',
        //     route: 'likes',
        //     active: false,

        // },
        {
            id: 3,
            title: 'Instagram',
            route: 'insta',
            active: false,

        }


    ]

    const activeClass = 'bg-yellow-500 transition'
    return (
        <nav className='bg-black w-full p-4 flex items-center justify-center fixed top-0 z-50'>
            <ul className='w-full flex items-center justify-center gap-4'>
                {links.map((link) => (
                    <li key={link.id} >
                        <Link
                            href={route(link.route)} as='button'
                            className={` shadow-inner shadow-black text-black cursor-pointer font-bold flex justify-between items-center w-full text-[10px] px-10 mt-4 py-2 rounded-sm hover:bg-green-400 transition ${page.component.toLowerCase().includes(link.route.toLowerCase()) ? 'bg-green-500 transition! text-gray-100 font-extrabold! text-sm!' :'bg-white' }`}
 >
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default EasyLayout
