import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

interface CreateOrderRequest {
  productId: string;
  quantity: number;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Headers('x-user-id') userId: string,
    @Body() request: CreateOrderRequest,
  ) {
    return this.ordersService.create(userId, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
