import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CicloCultivoOrmEntity } from '../../../../ciclos-cultivo/infrastructure/persistence/typeorm/ciclo-cultivo.orm-entity';

@Entity('estufas')
export class EstufaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nome: string;

  @Column({ type: 'date' })
  dataInauguracao: string;

  @Column({ type: 'boolean', default: true })
  ativa: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  areaM2: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CicloCultivoOrmEntity, (ciclo) => ciclo.estufa, {
    cascade: false,
    eager: false,
  })
  ciclosCultivo: CicloCultivoOrmEntity[];
}
