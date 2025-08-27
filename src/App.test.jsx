import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/routes";

beforeEach(() => {
  vi.restoreAllMocks(); // reset mocks between tests
});

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn()
}));

const sampleApplications = [{id: 1, fullName: "Prabhnoor Ughra", studentId: "123456789",
                email: "psughra@my.yorku.ca", program: "Computer Science", emailConsent: true, studyYear: "Third"},
            ];
const samplePagination =  {page: 1, totalPages: 1, total: sampleApplications.length};

//mock jwtDecode per test for specific cases
import { jwtDecode } from "jwt-decode"; 

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return <RouterProvider router={router} />;
}

describe('Home Page not logged in', () => {
    it("renders correct page", () => {
        render(renderAt("/"));
        expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Please Login/i)).toBeInTheDocument();
        expect((screen.getByRole("button").textContent)).toMatch(/Log In/i);
    });
});

describe('Login Page not logged in', () => {
    it("renders correct page", () => {
        render(renderAt("/login"));
        expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
        expect((screen.getByRole("button").textContent)).toMatch(/Log In/i);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });
});

describe('Error when logging in', () => {
    it("shows error when login fails", async () => {
        vi.spyOn(window, "fetch").mockResolvedValueOnce(
                new Response(JSON.stringify({ message: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            })
        );

        render(renderAt("/login"));

        await userEvent.type(screen.getByLabelText(/Email/i), "bad@example.com");
        await userEvent.type(screen.getByLabelText(/Password/i), "wrongpass");
        await userEvent.click(screen.getByRole("button", { name: /Log In/i }));

        expect(await screen.findByText(/Incorrect Username or Password/i)).toBeInTheDocument();
    });
})


describe('Successful login', () => {
  it("log in successfully, view home page and log out", async () => {
    vi.mocked(jwtDecode).mockReturnValue({
        id: "u1",
        exp: Date.now() / 1000 + 36000,
        role: "ADMIN",
        username: "testuser"
    });
    
    vi.spyOn(window, "fetch")
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ token: "fake.jwt.token" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ count: 123 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ count: 567 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    render(renderAt("/login"));

    await userEvent.type(screen.getByLabelText(/Email/i), "good@example.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "correctpass");
    await userEvent.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
        expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
        expect(screen.getByText(/View Applications/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));

    await waitFor(() => {
        expect(screen.getByRole("button").textContent).toMatch(/Log In/i);
    });
  });

  it("log in successfully, view applications and log out", async () => {
    vi.mocked(jwtDecode).mockReturnValue({
        id: "u1",
        exp: Date.now() / 1000 + 36000,
        role: "ADMIN",
        username: "testuser"
    });
    
    vi.spyOn(window, "fetch")
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ token: "fake.jwt.token" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ count: 123 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ count: 567 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ applications: sampleApplications ,
                pagination: samplePagination}), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ applications: sampleApplications ,
                pagination: samplePagination}), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ applications: [] ,
                pagination: {total: 0, page: 0, totalPages: 0}}), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        );


    render(renderAt("/login"));

    await userEvent.type(screen.getByLabelText(/Email/i), "good@example.com");
    await userEvent.type(screen.getByLabelText(/Password/i), "correctpass");
    await userEvent.click(screen.getByRole("button", { name: /Log In/i }));

    await waitFor(() => {
        expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
        expect(screen.getByText(/View Applications/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /View Applications/i }));
    expect(screen.getByText(/Prabhnoor Ughra/i)).toBeInTheDocument();
    expect(screen.getByText(/psughra@my.yorku.ca/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Study Year/i }));
    await userEvent.click(screen.getByRole("button", { name: /Third/i }));

    expect(screen.getByText(/Prabhnoor Ughra/i)).toBeInTheDocument();
    expect(screen.getByText(/psughra@my.yorku.ca/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Study Year/i }));
    await userEvent.click(screen.getByRole("button", { name: /First/i }));

    expect(screen.queryByText(/Prabhnoor Ughra/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/psughra@my.yorku.ca/i)).not.toBeInTheDocument();
    expect(screen.getByText(/No Results/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));

    await waitFor(() => {
        expect(screen.getByRole("button").textContent).toMatch(/Log In/i);
    });
  });
  
});


describe('Unknown Path', () => {
    it('unknown path → ErrorPage', () => {
        render(renderAt("/random"));
        expect(screen.getByText(/Error: Page Not Found./i)).toBeInTheDocument();
        expect((screen.getByRole("link").textContent)).toMatch(/Go Back Home/i);
  });
});

describe('Server Errors', () => {
    it("shows server error when logged in and 500 status returns from server", async () => {
        vi.mocked(jwtDecode).mockReturnValue({
            id: "u1",
            exp: Date.now() / 1000 + 36000,
            role: "ADMIN",
            username: "testuser"
        });
        vi.spyOn(window, "fetch")
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ token: "fake.jwt.token" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
                new Response(JSON.stringify({ message: "Error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            })
        );

        render(renderAt("/login"));

        await userEvent.type(screen.getByLabelText(/Email/i), "good@example.com");
        await userEvent.type(screen.getByLabelText(/Password/i), "rightpass");
        await userEvent.click(screen.getByRole("button", { name: /Log In/i }));

        expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));
    });
    it("shows server error when logged in and home page loads but applications dont", async () => {
        vi.mocked(jwtDecode).mockReturnValue({
            id: "u1",
            exp: Date.now() / 1000 + 36000,
            role: "ADMIN",
            username: "testuser"
        });
        vi.spyOn(window, "fetch")
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ token: "fake.jwt.token" }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ count: 123 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
            new Response(JSON.stringify({ count: 567 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        )
        .mockResolvedValueOnce(
                new Response(JSON.stringify({ message: "Error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            })
        );

        render(renderAt("/login"));

        await userEvent.type(screen.getByLabelText(/Email/i), "good@example.com");
        await userEvent.type(screen.getByLabelText(/Password/i), "rightpass");
        await userEvent.click(screen.getByRole("button", { name: /Log In/i }));

        expect(await screen.findByText(/Welcome Back/i)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /View Applications/i }));
        expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));
    });
})