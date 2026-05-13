import type { CSSProperties } from "react";

type UserRole = "user-freela" | "user-empresa";

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "280px 1fr",
  minHeight: "100vh",
};

const sidebarStyle: CSSProperties = {
  padding: 20,
  borderRight: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.03)",
};

const itemStyle: CSSProperties = {
  display: "block",
  padding: 10,
  borderRadius: 10,
  background: "rgba(255,255,255,0.06)",
};

function getRoleFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): UserRole {
  const value = searchParams.role;
  if (value === "user-freela" || value === "user-empresa") return value;
  return "user-freela";
}

function getSidebarItems(role: UserRole): { label: string; href: string }[] {
  if (role === "user-empresa") {
    return [
      { label: "Feed de Freelancers", href: "/app?role=user-empresa" },
      { label: "Meus Jobs", href: "/app?role=user-empresa" },
      { label: "Propostas por Job", href: "/app?role=user-empresa" },
      { label: "Recrutadores (opcional)", href: "/app?role=user-empresa" },
      { label: "Perfil da Empresa", href: "/app?role=user-empresa" },
      { label: "Notificações", href: "/app?role=user-empresa" },
      { label: "Configurações", href: "/app?role=user-empresa" },
    ];
  }

  return [
    { label: "Feed de Jobs", href: "/app?role=user-freela" },
    { label: "Minhas Propostas", href: "/app?role=user-freela" },
    { label: "Meu Perfil", href: "/app?role=user-freela" },
    { label: "Notificações", href: "/app?role=user-freela" },
    { label: "Configurações", href: "/app?role=user-freela" },
  ];
}

export default function AppShellPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const role = getRoleFromSearchParams(searchParams);
  const items = getSidebarItems(role);

  return (
    <main style={layoutStyle}>
      <aside style={sidebarStyle}>
        <div style={{ display: "grid", gap: 10 }}>
          <strong style={{ fontSize: 16 }}>Recifreela</strong>
          <div style={{ color: "rgba(234,240,255,0.7)" }}>Role: {role}</div>
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {items.map((item) => (
            <a key={item.label} href={item.href} style={itemStyle}>
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: 18,
            padding: 10,
            borderRadius: 10,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          Sair (mock)
        </a>
      </aside>

      <section style={{ padding: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, letterSpacing: -0.3 }}>
          Shell do app
        </h1>
        <p
          style={{
            color: "rgba(234,240,255,0.75)",
            lineHeight: 1.6,
            maxWidth: 820,
          }}
        >
          Esta tela é só para validar layout, navegação e separação por role no
          M0. No M1, ela deve depender de uma sessão real e renderizar os
          módulos conforme permissões.
        </p>
      </section>
    </main>
  );
}
