export default function Footer()
{
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 mt-16 ml-30">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 font-montserrat">
            RADION
          </h3>
          <p className="text-slate-400 max-w-sm leading-relaxed font-helvetica">
            Advancing radiological precision through neural-enhanced screening
            and AI-driven clinical insights.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4 font-montserrat ">
            Company
          </h4>
          <ul className="space-y-2 text-slate-400 text-sm font-helvetica">
            <li>
              <a href="/about" className="hover:text-blue-400 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/contact-us" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
}