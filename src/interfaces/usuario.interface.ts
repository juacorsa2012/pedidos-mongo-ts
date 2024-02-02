enum Rol {
  ADMIN = "ADMIN",
  USER = "USER"  
}

export interface Usuario {
  nombre: string,
  email: string,
  password: string,
  rol: Rol
}

