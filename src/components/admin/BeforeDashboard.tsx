/**
 * A friendly welcome card shown above the admin dashboard for non-technical
 * staff. Server component; styled via `.safar-welcome*` in `custom.scss` so it
 * follows the Ocean Breeze theme in both light and dark modes. The quick links
 * point at the tasks staff do most.
 */
export function BeforeDashboard() {
  return (
    <div className="safar-welcome">
      <h2 className="safar-welcome__title">Welcome to Safar</h2>
      <p className="safar-welcome__lead">
        Manage the trips, enquiries, and content on your website. Here are a few things you might
        want to do:
      </p>
      <ul className="safar-welcome__links">
        <li>
          <a href="/admin/collections/packages/create">Add a Package</a>
        </li>
        <li>
          <a href="/admin/collections/cruises/create">Add a Cruise</a>
        </li>
        <li>
          <a href="/admin/collections/leads">Review new Enquiries</a>
        </li>
      </ul>
    </div>
  )
}
