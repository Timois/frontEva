import { NavLink } from "react-router-dom"


export const Options = () => {
    const string = [
      {text: "Unidad Academica", path: "/academic_unit"},
      {text: "Carreras", path: "/career"},
      {text: "Gestion Academica", path: "/academic_management "}
    ]
  return (
    <ul className="list-unstyled">
      {string.map((item, index) => (  
        <li key={index} className="mb-2">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `text-decoration-none d-block px-3 py-2 rounded ${
                isActive ? "bg-primary text-white" : "text-dark"
              }`
            }
          >
            {item.text}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
