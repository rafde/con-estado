import GithubIcon from '../ui/githubIcon';
import NavHiddenCheck from './navHiddenCheck';
import NavList from './navList';
import NavOverlayCloseButton from './navOverlayCloseButton';
import NavOverlyHiddenCheck from './navOverlayHiddenCheck';

export default function NavSidebar() {
	return <>
		<NavOverlyHiddenCheck />
		<NavHiddenCheck />
		<aside
			className={'overflow-hidden transition-[background,opacity,z-index,width] duration-300'
				+ ' peer-not-checked/overlay:opacity-0 peer-not-checked/overlay:fixed peer-not-checked/overlay:inset-0 peer-not-checked/overlay:-z-10 peer-not-checked/overlay:bg-transparent'
				+ ' peer-checked/overlay:opacity-100 peer-checked/overlay:fixed peer-checked/overlay:inset-0 peer-checked/overlay:z-10 peer-checked/overlay:bg-slate-500/50'
				+ ' peer-checked/overlay:*:translate-x-0'

				+ ' sm:max-w-(--navbar-max-width) sm:w-0 sm:opacity-0 static'
				+ ' sm:peer-checked/side:opacity-100 sm:peer-checked/side:static sm:peer-checked/side:z-10 sm:peer-checked/side:w-full'
				+ ' sm:peer-checked/side:*:translate-x-0'}>
			<nav
				className="flex flex-col space-y-2 overflow-hidden bg-black pb-3 h-screen border-r border-white max-w-(--navbar-max-width) transition-[translate,opacity] duration-300 -translate-x-full"
			>
				<header className="flex px-2 py-1 justify-items-center mb-0">
					<a
						href="https://github.com/rafde/con-estado"
						target="_blank"
						className="size-5 overflow-hidden self-center"
						rel="noreferrer"
						aria-label="Link to open new window con-estado GitHub repository"
					>
						<GithubIcon />
					</a>
					<h1 className="grow text-wrap text-2xl font-bold text-center">
						con-estado
					</h1>
					<NavOverlayCloseButton />
				</header>
				<NavList />
			</nav>
		</aside>
	</>;
}
