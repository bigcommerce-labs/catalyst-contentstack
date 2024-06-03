interface ObjectProps {
  html_code_alignment: string;
  title: string;
  description: string;
  html_code: string;
}

export default function SectionWithHtmlCode({ embedCode }: { embedCode: ObjectProps }) {
  if (embedCode.html_code_alignment === 'Left') {
    return (
      <div className="contact-page-section max-width">
        <div className="contact-page-content">
          <h1>{embedCode.title}</h1>
          {typeof embedCode.description === 'string' && (
            <div dangerouslySetInnerHTML={{ __html: embedCode.description }} />
          )}
        </div>
        <div className="contact-page-form">
          {typeof embedCode.html_code === 'string' && (
            <div dangerouslySetInnerHTML={{ __html: embedCode.html_code }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-maps-section max-width">
      <div className="maps-details">
        {typeof embedCode.html_code === 'string' && (
          <div dangerouslySetInnerHTML={{ __html: embedCode.html_code }} />
        )}
      </div>
      <div className="contact-maps-content">
        {embedCode.title ? <h2>{embedCode.title}</h2> : ''}
        {typeof embedCode.description === 'string' && (
          <div dangerouslySetInnerHTML={{ __html: embedCode.description }} />
        )}
      </div>
    </div>
  );
}
