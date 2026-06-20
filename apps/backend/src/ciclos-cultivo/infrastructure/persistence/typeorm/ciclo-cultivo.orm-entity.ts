import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstufaOrmEntity } from '../../../../estufas/infrastructure/persistence/typeorm/estufa.orm-entity';

@Entity('ciclos_cultivo')
export class CicloCultivoOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  variedadePlanta: string;

  @Column({ type: 'date' })
  dataInicio: string;

  @Column({ type: 'boolean', default: false })
  colhida: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rendimentoKg: number;

  @Column({ name: 'estufa_id' })
  estufaId: number;

  @ManyToOne(() => EstufaOrmEntity, (estufa) => estufa.ciclosCultivo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'estufa_id' })
  estufa: EstufaOrmEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
