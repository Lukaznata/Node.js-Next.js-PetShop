import Clientes from "./Clientes.js";
import Pets from "./Pets.js";
import Agendamentos from "./Agendamentos.js";
import Servicos from "./Servicos.js";
import AgendamentosServicos from "./AgendamentosServicos.js";
import EnderecosClientes from "./EnderecosClientes.js";

Clientes.hasMany(Pets, { foreignKey: "id_cliente" });
Pets.belongsTo(Clientes, { foreignKey: "id_cliente" });

Pets.hasMany(Agendamentos, { foreignKey: "id_pet" });
Agendamentos.belongsTo(Pets, { foreignKey: "id_pet" });

Agendamentos.hasMany(AgendamentosServicos, { foreignKey: "id_agendamento" });
AgendamentosServicos.belongsTo(Agendamentos, { foreignKey: "id_agendamento" });

Servicos.hasMany(AgendamentosServicos, { foreignKey: "id_servico" });
AgendamentosServicos.belongsTo(Servicos, { foreignKey: "id_servico" });

Clientes.hasMany(EnderecosClientes, { foreignKey: "id_cliente" });
EnderecosClientes.belongsTo(Clientes, { foreignKey: "id_cliente" });
