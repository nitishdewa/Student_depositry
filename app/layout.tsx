
import './globals.css';

export const metadata = {
  title: 'EduAdmin - Student Directory',
  description: 'Registry Office',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="sidebar">
          <div className="logo">
            EduAdmin
            <span>Registry Office</span>
          </div>
          <ul className="menu">
            <li><i className="ri-dashboard-line"></i> Dashboard</li>
            <li className="active"><i className="ri-user-line"></i> Student Directory</li>
            <li><i className="ri-user-star-line"></i> Faculty</li>
            <li><i className="ri-file-text-line"></i> Reports</li>
            <li><i className="ri-settings-line"></i> Settings</li>
          </ul>

          <button className="sidebar-btn">
            <i className="ri-add-line"></i> Quick Action
          </button>
        </div>

        <div className="main">{children}</div>
      </body>
    </html>
  );
}