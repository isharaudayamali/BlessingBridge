import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer className="mt-auto flex w-full flex-col items-center justify-center space-y-4 border-t border-[#d0c5af]/20 bg-[#f4f4f2] px-8 py-12 text-center font-['Inter'] text-sm tracking-wide dark:bg-[#1a1c1b]">
			<div className="flex flex-wrap justify-center gap-8 text-[#1a1c1b]/50 dark:text-[#f9f9f7]/50">
				<button
					type="button"
					className="cursor-pointer transition-colors hover:text-[#d4af37]"
					onClick={() => navigate('/privacy')}
				>
					Privacy Policy
				</button>
				<button
					type="button"
					className="cursor-pointer transition-colors hover:text-[#d4af37]"
					onClick={() => navigate('/terms')}
				>
					Terms of Service
				</button>
				<button
					type="button"
					className="cursor-pointer transition-colors hover:text-[#d4af37]"
					onClick={() => navigate('/support')}
				>
					Contact Support
				</button>
			</div>
			<p className="text-[#735c00] dark:text-[#d4af37]">© 2024 BlessingBridge. Walking in Grace.</p>
		</footer>
	);
};

export default Footer;