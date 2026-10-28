import type { ReactNode } from 'react';

// מסגרת משותפת למסכי התחברות והרשמה: צד דקורטיבי, וצד הטופס
const AuthShell = ({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) => {
    return (
        <div className="grid min-h-screen md:grid-cols-[1.1fr_1fr]">
            {/* הצד הדקורטיבי (בעברית הוא מימין) */}
            <aside className="relative isolate hidden overflow-hidden bg-sapphire p-12 text-white md:flex md:flex-col md:justify-between">
                <div className="ornament absolute inset-0 -z-10 opacity-40" aria-hidden />
                <div className="absolute -bottom-40 -left-32 -z-10 size-[30rem] rounded-full bg-gold/25 blur-3xl animate-drift" aria-hidden />

                <span className="font-display text-3xl text-gold-soft">מתכנן שמחות</span>

                <div className="animate-page-in">
                    <div className="mb-8 flex max-w-48 items-center gap-3 text-gold-light">
                        <span className="h-px flex-1 bg-gold-light/60" />
                        <span>✦</span>
                        <span className="h-px flex-1 bg-gold-light/60" />
                    </div>
                    <p className="font-display text-5xl leading-tight">
                        כל ההכנות לשמחה,
                        <br />
                        במקום אחד.
                    </p>
                    <p className="mt-6 max-w-sm text-lg text-white/75">
                        המארגן פותח שמחה, כל אחד מהמשפחה לוקח משימה, וכולם רואים מה כבר מוכן ומה עוד נשאר.
                    </p>
                </div>

                <p className="text-sm text-white/50">סעודת הודיה, סיום מסכת, שבע ברכות, יום הולדת</p>
            </aside>

            {/* צד הטופס */}
            <div className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm animate-page-in">
                    <span className="mb-10 block font-display text-3xl text-gold md:hidden">מתכנן שמחות</span>
                    <h1 className="text-5xl">{title}</h1>
                    <p className="mt-2 mb-8 text-mist">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthShell;
