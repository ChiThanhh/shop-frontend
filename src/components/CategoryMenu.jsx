import React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link, useNavigate } from "react-router-dom"

export default function CategoryMenu({ categories }) {
  const navigate = useNavigate()

  const getChildren = (parentId) =>
    categories
      .filter((cat) => cat.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order)

  const handleCategoryClick = (cat) => {
    navigate(`/product-list?category=${cat.category_id}`)
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories
          .filter((item) => item.level === "1")
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => {
            const children = getChildren(item.category_id)

            return (
              <NavigationMenuItem key={item.category_id}>
                {children.length > 0 ? (
                  <>
                    <NavigationMenuTrigger  className="hover:text-primary cursor-pointer ">
                        <Link to={`/product-list?category=${item.category_id}`}>
                          {item.name}
                        </Link>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-2 p-4 w-64">
                        {children.map((child) => (
                          <li key={child.category_id}>
                            <NavigationMenuLink asChild>
                              <button
                                onClick={() => handleCategoryClick(child)}
                                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                              >
                                {child.name}
                              </button>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <button
                      onClick={() => handleCategoryClick(item)}
                      className="px-3 py-2 hover:text-primary font-medium"
                    >
                      {item.name}
                    </button>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            )
          })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
