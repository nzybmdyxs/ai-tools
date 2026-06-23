// ==========================================
// SpringBoot 项目 → 架构图（零 AI 成本）
// ==========================================

/** SpringBoot 注解 → Mermaid 架构图 */
export function springBootArchitecture(source: string): { code: string } {
  const hasController = /@RestController|@Controller/.test(source);
  const hasService = /@Service/.test(source);
  const hasRepository = /@Repository/.test(source);
  const hasEntity = /@Entity/.test(source);
  const hasComponent = /@Component/.test(source);
  const hasConfig = /@Configuration|@SpringBootApplication/.test(source);

  let mermaid = "flowchart TB\n";

  if (hasConfig) {
    mermaid += "  Config[SpringBoot Application]\n";
  }

  if (hasController) {
    mermaid += "  Controller[Controller Layer]\n";
    mermaid += "  Client[Client] --> Controller\n";
  }

  if (hasService) {
    mermaid += "  Service[Service Layer]\n";
    if (hasController) mermaid += "  Controller --> Service\n";
  }

  if (hasRepository) {
    mermaid += "  Repository[Repository Layer]\n";
    if (hasService) mermaid += "  Service --> Repository\n";
    mermaid += "  DB[(Database)]\n";
    mermaid += "  Repository --> DB\n";
  }

  if (hasEntity) {
    if (hasRepository) {
      mermaid += "  Repository --> Entity[Entity]\n";
    } else {
      mermaid += "  Entity[Entity]\n";
    }
  }

  if (hasComponent && !hasService && !hasRepository) {
    mermaid += "  Component[Component]\n";
  }

  if (!hasController && !hasService && !hasRepository) {
    mermaid += "  % 未检测到 Spring 注解\n";
  }

  return { code: mermaid.trim() };
}
