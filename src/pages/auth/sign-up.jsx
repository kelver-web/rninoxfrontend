// import {
//   Card,
//   Input,
//   Checkbox,
//   Button,
//   Typography,
 
// } from "@material-tailwind/react";
// import { Link } from "react-router-dom";
// import React, { useContext, useState } from "react";
// import {AuthContext} from "../../context/AuthContext";


// export function SignUp() {
//   const { registerUser } = useContext(AuthContext);
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     password2: "",
//     first_name: "",
//     last_name: "",
   
//   });


//   // Função para lidar com mudanças nos campos de input
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // REMOVIDO: useEffect para carregar as listas de cargos e equipes

//   // Função para lidar com o envio do formulário
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.password2) {
//       alert("As senhas não conferem!");
//       return;
//     }

//     // Apenas os dados do User são enviados
//     const dataToSend = {
//       username: formData.username,
//       email: formData.email,
//       first_name: formData.first_name,
//       last_name: formData.last_name,
//       password: formData.password,
//       password2: formData.password2,
//     };

//     await registerUser(dataToSend);
//   };

//   return (
//     <section className="m-8 flex">
//       <div className="w-2/5 h-full hidden lg:block">
//         <img
//           src="/img/pattern.png"
//           className="h-full w-full object-cover rounded-3xl"
//         />
//       </div>
//       <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
//         <div className="text-center">
//           <Typography variant="h2" className="font-bold mb-4">Cadastre-se</Typography>
//           <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
//             Preencha seus dados para criar sua conta.
//           </Typography>
//         </div>
//         <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
//           <div className="mb-1 flex flex-col gap-6">
//             {/* Campo: Nome de usuário */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Nome de usuário
//             </Typography>
//             <Input
//               size="lg"
//               placeholder="seu_usuario"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* Campo: Email */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Seu Email
//             </Typography>
//             <Input
//               type="email"
//               size="lg"
//               placeholder="nome@mail.com"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* Campo: Primeiro Nome */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Primeiro Nome
//             </Typography>
//             <Input
//               size="lg"
//               placeholder="Seu primeiro nome"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* Campo: Último Nome */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Último Nome
//             </Typography>
//             <Input
//               size="lg"
//               placeholder="Seu último nome"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* Campo: Senha */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Senha
//             </Typography>
//             <Input
//               type="password"
//               size="lg"
//               placeholder="********"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* Campo: Confirmar Senha */}
//             <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
//               Confirmar Senha
//             </Typography>
//             <Input
//               type="password"
//               size="lg"
//               placeholder="********"
//               name="password2"
//               value={formData.password2}
//               onChange={handleChange}
//               required
//               className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
//               labelProps={{ className: "before:content-none after:content-none" }}
//             />

//             {/* REMOVIDO: Seletores de Cargo e Equipe */}

//           </div>
//           {/* REMOVIDO: Checkbox "I agree the Terms and Conditions" */}
//           <Button className="mt-6" fullWidth type="submit">
//             Cadastrar Agora
//           </Button>

//           {/* REMOVIDO: Botões de login social */}

//           <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
//             Já tem uma conta?{" "}
//             <Link to="/auth/sign-in" className="text-gray-900 ml-1">
//               Entrar
//             </Link>
//           </Typography>
//         </form>
//       </div>
//     </section>
//   );
// }

// export default SignUp;
