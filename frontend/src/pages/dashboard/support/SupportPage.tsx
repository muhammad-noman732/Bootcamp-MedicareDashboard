import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupport } from "@/hooks/useSupport";
import {
    Search,
    MessageCircle,
    Mail,
    Phone,
    FileText,
    ShieldCheck,
    LifeBuoy,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Plus
} from "lucide-react";

export default function SupportPage() {
    const { faqs, activeFaq, toggleFaq } = useSupport();

    return (
        <div className="flex flex-col space-y-8 p-6 pb-20 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-12 md:py-16 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                        <LifeBuoy className="mr-2 h-4 w-4" /> 24/7 Support Available
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
                        How can we help you today, Doctor?
                    </h1>
                    <p className="text-primary-foreground/80 max-w-xl text-lg">
                        Search our knowledge base or reach out to our dedicated medical support team for any assistance with your practice.
                    </p>
                    <div className="relative w-full max-w-xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search for articles, guides, and more..."
                            className="h-14 w-full rounded-2xl border-none bg-white pl-12 pr-4 text-black shadow-lg focus-visible:ring-offset-0"
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold tracking-tight px-1 text-[#0000AC]">Rapid Contact</h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                { icon: MessageCircle, title: "Live Chat", desc: "Available 8am-8pm EST", action: "Start Chat", color: "text-blue-500", bg: "bg-blue-50" },
                                { icon: Mail, title: "Email Support", desc: "Response within 2 hours", action: "Send Email", color: "text-emerald-500", bg: "bg-emerald-50" },
                                { icon: Phone, title: "Phone Support", desc: "Direct medical priority line", action: "Call Now", color: "text-rose-500", bg: "bg-rose-50" }
                            ].map((item, i) => (
                                <Card key={i} className="group border-none shadow-sm hover:shadow-md transition-all">
                                    <CardContent className="pt-6 text-center space-y-4">
                                        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">{item.title}</h3>
                                            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full">
                                            {item.action}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-xl font-bold tracking-tight text-[#0000AC]">Frequently Asked Questions</h2>
                            <Button variant="link" size="sm" className="text-primary p-0">
                                View All Help Articles <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                        <div className="grid gap-3">
                            {faqs.map((faq, i) => (
                                <Card
                                    key={i}
                                    className={`border-none shadow-sm overflow-hidden transition-all duration-300 ${activeFaq === i ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                                >
                                    <CardContent className="p-0">
                                        <button
                                            onClick={() => toggleFaq(i)}
                                            className="flex items-center justify-between w-full p-4 text-left outline-none"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${activeFaq === i ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-sm">{faq.question}</span>
                                            </div>
                                            {activeFaq === i ? (
                                                <ChevronUp className="h-4 w-4 text-primary" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </button>
                                        {activeFaq === i && (
                                            <div className="px-16 pb-4 pt-0 text-sm text-balance leading-relaxed">
                                                <div className="h-px w-full bg-primary/10 mb-3" />
                                                {faq.answer}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-lg h-fit">
                        <CardHeader className="bg-primary/5 rounded-t-xl">
                            <CardTitle className="text-lg flex items-center gap-2 text-[#0000AC]">
                                <Plus className="h-5 w-5 text-primary" /> Create Ticket
                            </CardTitle>
                            <CardDescription>Get technical help for your practice.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="subject">Support Subject</Label>
                                <Input id="subject" placeholder="What do you need help with?" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Explain your issue</Label>
                                <Textarea id="message" placeholder="Provide details about the problem..." className="h-40 resize-none" />
                            </div>

                            <Button className="w-full h-11 shadow-md">
                                Send Support Request
                            </Button>

                            <div className="mt-4 pt-4 border-t space-y-3">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span>HIPAA Compliant Support Portal</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
