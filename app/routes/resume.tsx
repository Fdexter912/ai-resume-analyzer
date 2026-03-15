import {Link, useLocation, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";

export const meta = () => ([
    { title: 'ResumeIQ | Review' },
    { name: 'description', content: 'Detailed review of your resume' }
])
const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [ imageUrl, setImageUrl ] = useState('');
    const [ resumeUrl, setResumeUrl ] = useState('');
    const [ feedback, setFeedback ] = useState< Feedback | null >(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;
            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
            console.log({resumeUrl, imageUrl, feedback: data.feedback});
        }
        loadResume();

    }, [id])
    return (
        <main className="!pt-0 bg-main dark:bg-main-dark transition-colors duration-500 min-h-screen">
            <Navbar/>
            {/*<nav className="resume-nav dark:bg-[#0d0f1a] dark:border-[#2a2f45]">*/}
            {/*    <Link to="/" className="back-button dark:border-[#2a2f45] dark:bg-[#13161f]">*/}
            {/*        <img src="/icons/back.svg" alt="Back" className="w-2.5 h-2.5" />*/}
            {/*        <span className="text-gray-800 dark:text-gray-300 text-sm font-semibold">Back to Homepage</span>*/}
            {/*    </Link>*/}
            {/*</nav>*/}
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-small dark:bg-small-dark flex items-start justify-center overflow-y-auto transition-colors duration-500">
                    {imageUrl && resumeUrl ? (
                        <div className="animate-in fade-in duration-1000 gradient-border w-full">
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={imageUrl}
                                    alt="resume image"
                                    className="w-full object-contain rounded-2xl"
                                    title="resume"
                                />
                            </a>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm mt-10">Loading resume...</p>
                    )}
                </section>
                <section className="feedback-section dark:bg-[#0d0f1a] transition-colors duration-500">
                    <h2 className="text-4xl !text-black dark:!text-white font-bold">Resume Review</h2>
                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                            <Summary feedback={feedback}/>
                            <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                            <Details feedback={feedback}/>
                        </div>
                    ) : (
                        <img src="/images/resume-scan-2.gif" className="w-full" />
                    )}
                </section>
            </div>
        </main>
    )
}

export default Resume;