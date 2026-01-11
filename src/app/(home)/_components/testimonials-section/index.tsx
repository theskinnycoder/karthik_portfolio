import Image from "next/image";
import { TestimonialCard, type TestimonialCardProps } from "./testimonial-card";

const testimonials = [
	{
		quote:
			"Karthik is a versatile and insightful designer who deeply understands business requirements and translates them into seamless, impactful product experiences. His ability to design features that not only solve business needs but also enhance usability makes a significant difference. The customisations he delivers are incredibly intuitive, making it effortless for product managers and growth teams to achieve complex nudge designs. His attention to detail and problem-solving mindset have been invaluable in shaping user-centric solutions at Apxor",
		author: {
			name: "Dr. Bharghava",
			role: "Head, Product & Innovation at",
			company: "Apxor",
			companyLogo: "/apxor-logo.svg",
			avatar: "/bharghava-avatar.svg",
		},
	},
	{
		quote:
			"Karthik has an exceptional ability to quickly grasp complex concepts and think from the user's perspective. His rapid learning curve and deep curiosity enabled him to grow from zero product knowledge to an advanced level. He took the responsibility of redesigning the entire Apxor dashboard with flow optimisations, significantly improving efficiency—processes that once took hours are now completed in minutes. His ability to streamline user journeys and enhance usability has made a remarkable impact on the product experience. As a result, both internal dashboard training and Apxor's client training sessions have been significantly reduced, as users now find the dashboard much more intuitive and easy to navigate.",
		author: {
			name: "Prabhu Konchada",
			role: "Senior Product Manager at",
			company: "Apxor",
			companyLogo: "/apxor-logo.svg",
			avatar: "/prabhu-avatar.svg",
		},
	},
	{
		quote:
			"I closely worked with Karthik throughout the design handoff process, where he played a crucial role in bridging the gap between developers and the product team. He designed intuitive flows that ensure a seamless user journey, allowing developers to clearly understand what happens at every step. His approach eliminates ambiguity, so developers never get stuck wondering what comes next. Additionally, his well-structured design components have significantly reduced development time, making implementation smoother and more efficient",
		author: {
			name: "Ravi Teja Akella",
			role: "Engineering Head at",
			company: "Apxor",
			companyLogo: "/apxor-logo.svg",
			avatar: "/ravi-avatar.svg",
		},
	},
	{
		quote:
			"During my time at Apxor, I had the privilege of collaborating with Karthik, who truly stood out with his remarkable skills and commitment. As a Designer and Team Lead, he thrived in rapid prototyping alongside engineers, meticulously refining every aspect of our projects. Karthik's unique talent for merging design with effective leadership makes him an exceptional addition to any team.",
		author: {
			name: "Raja S",
			role: "CEO & Founder at",
			company: "Hearzap",
			companyLogo: "/hearzap-logo.svg",
			avatar: "/raja-avatar.svg",
		},
	},
] satisfies TestimonialCardProps[];

export function TestimonialsSection() {
	return (
		<section className="flex flex-col items-center gap-7">
			<h2 className="text-center font-serif text-4xl">
				<span className="text-muted-foreground">What people have to </span>
				<div className="inline-flex items-baseline space-x-2 md:inline">
					<span className="bg-linear-to-r from-[#A88BFA] to-[#EFAAFB] bg-clip-text text-transparent">
						say about me :
					</span>
					<Image
						src="/heart-icon.svg"
						alt="heart icon"
						width={20}
						height={20}
						className="inline"
					/>
				</div>
			</h2>

			<div className="flex w-full flex-col gap-[18px]">
				{testimonials.map((testimonial) => (
					<TestimonialCard
						key={testimonial.author.name}
						{...testimonial}
					/>
				))}
			</div>
		</section>
	);
}
