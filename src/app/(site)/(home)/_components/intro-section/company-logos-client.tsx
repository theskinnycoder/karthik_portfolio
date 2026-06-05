"use client";

import { MediaImage } from "@/components/media";
import type { CompanyDTO } from "@/sanity/lib/dal";
import { motion } from "motion/react";
import * as React from "react";

interface CompanyLogosClientProps {
	companies: CompanyDTO[];
}

export function CompanyLogosClient({ companies }: CompanyLogosClientProps) {
	return (
		<div className="flex flex-wrap items-center gap-x-4 gap-y-4">
			{companies.map((company, index) => (
				<React.Fragment key={company.name}>
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ ease: "easeOut", duration: 0.5, delay: index * 0.1 }}
					>
						<MediaImage
							src={company.logo}
							alt={company.name}
							width={0}
							height={0}
							className="h-[30px] w-auto object-contain object-left md:h-[34px]"
							sizes="100vw"
							loading="eager"
						/>
					</motion.div>
					{index === 1 && (
						<div
							className="basis-full min-[425px]:hidden"
							aria-hidden="true"
						/>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
