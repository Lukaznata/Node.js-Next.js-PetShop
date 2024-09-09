import Clientes from "./Clientes";
import Pets from "./Pets";
import Agendamentos from "./Agendamentos";
import Servicos from "./Servicos";
import AgendamentosServicos from "./AgendamentosServicos";
import EnderecosClientes from "./EnderecosClientes";

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
