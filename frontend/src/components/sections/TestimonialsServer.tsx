import { getTestimonials } from "@/lib/cms";
import { FALLBACK_TESTIMONIALS } from "@/constants/fallback-testimonials";
import TestimonialsClient from "@/components/sections/Testimonials";

export default async function TestimonialsServer() {
  const cmsTestimonials = await getTestimonials();
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : FALLBACK_TESTIMONIALS;
  return <TestimonialsClient testimonials={testimonials} />;
}
